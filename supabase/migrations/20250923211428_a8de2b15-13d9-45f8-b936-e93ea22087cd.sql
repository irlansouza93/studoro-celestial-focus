-- ==========================================
-- STUDORO v2.0 - INSERIR CONQUISTAS BÁSICAS
-- ==========================================

-- Verificar se já existem conquistas antes de inserir
INSERT INTO public.achievements (name, description, condition_type, condition_value, xp_reward, icon) 
SELECT * FROM (VALUES
  ('Primeira Sessão', 'Complete sua primeira sessão de estudos', 'total_sessions', 1, 50, '🎯'),
  ('Estudante Dedicado', 'Complete 10 sessões de estudo', 'total_sessions', 10, 100, '📚'),
  ('Uma Semana', 'Mantenha um streak de 7 dias', 'daily_streak', 7, 150, '🌟'),
  ('Maratonista', 'Estude por 2 horas seguidas', 'single_session_time', 120, 100, '⏰'),
  ('Iniciante', 'Alcance 500 XP total', 'total_xp', 500, 100, '⭐')
) AS v(name, description, condition_type, condition_value, xp_reward, icon)
WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE achievements.name = v.name);

-- ==========================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, total_xp, current_level, current_streak, longest_streak)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Usuário'), 0, 1, 0, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente  
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();