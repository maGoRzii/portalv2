import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SummaryPrint } from '../components/admin/SummaryPrint';
import { PrintButton } from '../components/admin/PrintButton';
import { useAuth } from '../hooks/useAuth';

export function PrintSummary() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date') || '';

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const loadSubmissions = async () => {
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSubmissions(data || []);
      } catch (error) {
        console.error('Error loading submissions:', error);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [navigate, user]);

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

  return (
    <div>
      <div className="fixed top-4 right-4 no-print">
        <PrintButton onClick={handlePrint} />
      </div>
      <SummaryPrint submissions={submissions} selectedDate={selectedDate} />
    </div>
  );
}