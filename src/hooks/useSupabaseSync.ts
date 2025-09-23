import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  target_hours_per_week: number;
  total_study_time: number; // em minutos
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string;
  session_type: 'pomodoro' | 'free' | 'break';
  started_at: string;
  ended_at: string;
  duration_minutes: number;
  xp_earned: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition_type: string;
  condition_value: number;
  xp_reward: number;
  icon: string;
  created_at: string;
}

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================================
  // PROFILE MANAGEMENT
  // ===============================================

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return;
    }

    setProfile(data);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      return;
    }

    await fetchProfile();
  };

  // ===============================================
  // SUBJECTS MANAGEMENT
  // ===============================================

  const fetchSubjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar matérias:', error);
      return;
    }

    setSubjects(data || []);
  };

  const addSubject = async (subject: {
    name: string;
    icon: string;
    color: string;
    target_hours_per_week?: number;
  }) => {
    if (!user) return;

    const { error } = await supabase
      .from('subjects')
      .insert({
        ...subject,
        user_id: user.id,
        target_hours_per_week: subject.target_hours_per_week || 0
      });

    if (error) {
      console.error('Erro ao adicionar matéria:', error);
      return;
    }

    await fetchSubjects();
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const { error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar matéria:', error);
      return;
    }

    await fetchSubjects();
  };

  const deleteSubject = async (id: string) => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar matéria:', error);
      return;
    }

    await fetchSubjects();
  };

  // ===============================================
  // STUDY SESSIONS MANAGEMENT
  // ===============================================

  const fetchRecentSessions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        *,
        subjects (name, icon, color)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar sessões:', error);
      return;
    }

    setRecentSessions((data || []) as StudySession[]);
  };

  const recordSession = async (session: {
    subject_id: string;
    session_type: 'pomodoro' | 'free' | 'break';
    started_at: string;
    ended_at: string;
    duration_minutes: number;
  }) => {
    if (!user) return;

    const { error } = await supabase
      .from('study_sessions')
      .insert({
        ...session,
        user_id: user.id
      });

    if (error) {
      console.error('Erro ao registrar sessão:', error);
      return;
    }

    // Refresh data after recording
    await Promise.all([
      fetchProfile(),
      fetchSubjects(),
      fetchRecentSessions()
    ]);
  };

  // ===============================================
  // ACHIEVEMENTS MANAGEMENT
  // ===============================================

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('condition_value', { ascending: true });

    if (error) {
      console.error('Erro ao buscar conquistas:', error);
      return;
    }

    setAchievements(data || []);
  };

  const fetchUserAchievements = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao buscar conquistas do usuário:', error);
      return [];
    }

    return data || [];
  };

  // ===============================================
  // INITIALIZATION
  // ===============================================

  useEffect(() => {
    if (user) {
      const initializeData = async () => {
        setLoading(true);
        await Promise.all([
          fetchProfile(),
          fetchSubjects(),
          fetchRecentSessions(),
          fetchAchievements()
        ]);
        setLoading(false);
      };

      initializeData();
    } else {
      setProfile(null);
      setSubjects([]);
      setRecentSessions([]);
      setLoading(false);
    }
  }, [user]);

  return {
    // Data
    profile,
    subjects,
    recentSessions,
    achievements,
    loading,

    // Profile methods
    updateProfile,

    // Subjects methods
    addSubject,
    updateSubject,
    deleteSubject,

    // Sessions methods
    recordSession,

    // Achievements methods
    fetchUserAchievements,

    // Refresh methods
    refresh: () => {
      if (user) {
        fetchProfile();
        fetchSubjects();
        fetchRecentSessions();
      }
    }
  };
};