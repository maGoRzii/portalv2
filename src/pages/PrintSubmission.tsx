import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PrintView } from '../components/admin/PrintView';
import { PrintButton } from '../components/admin/PrintButton';
import { useAuth } from '../hooks/useAuth';

export function PrintSubmission() {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const loadSubmission = async () => {
      try {
        const { data, error } = await supabase
          .from('holiday_submissions')
          .select(`
            *,
            holiday_shifts (
              holiday_date,
              compensation_type
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setSubmission(data);
      } catch (error) {
        console.error('Error loading submission:', error);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [id, navigate, user]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <div>
      <div className="fixed top-4 right-4 no-print">
        <PrintButton onClick={handlePrint} />
      </div>
      <PrintView submission={submission} />
    </div>
  );
}