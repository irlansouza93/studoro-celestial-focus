-- ==========================================
-- CORREÇÕES DE SEGURANÇA - SEARCH PATH
-- ==========================================

-- Atualizar todas as funções com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.calculate_session_xp(
    duration_minutes INTEGER,
    session_type VARCHAR,
    user_streak INTEGER
) RETURNS INTEGER AS $$
DECLARE
    base_xp INTEGER;
    bonus_multiplier DECIMAL := 1.0;
BEGIN
    -- XP base: 1 por minuto
    base_xp := duration_minutes;
    
    -- Bônus para Pomodoro completo (25+ minutos)
    IF session_type = 'pomodoro' AND duration_minutes >= 25 THEN
        bonus_multiplier := bonus_multiplier + 0.5;
    END IF;
    
    -- Bônus de streak (máximo 100%)
    bonus_multiplier := bonus_multiplier + LEAST(user_streak * 0.1, 1.0);
    
    RETURN FLOOR(base_xp * bonus_multiplier);
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_stats_after_session()
RETURNS TRIGGER AS $$
DECLARE
    calculated_xp INTEGER;
    user_streak INTEGER;
BEGIN
    -- Buscar streak atual do usuário
    SELECT current_streak INTO user_streak FROM profiles WHERE id = NEW.user_id;
    
    -- Calcular XP da sessão
    calculated_xp := calculate_session_xp(NEW.duration_minutes, NEW.session_type, user_streak);
    
    -- Atualizar XP da sessão
    NEW.xp_earned := calculated_xp;
    
    -- Atualizar estatísticas da matéria
    UPDATE subjects SET 
        total_study_time = total_study_time + NEW.duration_minutes,
        total_sessions = total_sessions + 1,
        updated_at = NOW()
    WHERE id = NEW.subject_id;
    
    -- Atualizar XP do usuário e calcular novo level
    UPDATE profiles SET 
        total_xp = total_xp + calculated_xp,
        current_level = FLOOR(SQRT(total_xp + calculated_xp) / 10) + 1,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, total_xp, current_level, current_streak, longest_streak)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Usuário'), 0, 1, 0, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;