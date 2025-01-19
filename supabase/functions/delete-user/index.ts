import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create authenticated Supabase client using service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get request body
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('Missing user ID');
    }

    // First, remove any role assignments
    const { error: roleError } = await supabaseClient
      .from('admin_roles')
      .delete()
      .eq('user_id', userId);

    if (roleError) {
      console.error('Error deleting role:', roleError);
    }

    // Delete user
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(
      userId
    );

    if (deleteError) throw deleteError;

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.details || error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});