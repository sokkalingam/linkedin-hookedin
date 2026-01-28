import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find webhooks not accessed in 30 days
    const { data: expiredWebhooks, error: fetchError } = await supabase
      .from('webhooks')
      .select('id')
      .lt('last_accessed_at', thirtyDaysAgo.toISOString());

    if (fetchError) {
      console.error('Error fetching expired webhooks:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch expired webhooks' },
        { status: 500 }
      );
    }

    if (!expiredWebhooks || expiredWebhooks.length === 0) {
      return NextResponse.json(
        { success: true, message: 'No expired webhooks found', deleted: 0 },
        { status: 200 }
      );
    }

    // Delete expired webhooks (events will cascade delete automatically)
    const webhookIds = expiredWebhooks.map(w => w.id);
    const { error: deleteError } = await supabase
      .from('webhooks')
      .delete()
      .in('id', webhookIds);

    if (deleteError) {
      console.error('Error deleting expired webhooks:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete expired webhooks' },
        { status: 500 }
      );
    }

    console.log(`Cleanup complete: Deleted ${expiredWebhooks.length} expired webhooks`);

    return NextResponse.json(
      {
        success: true,
        message: 'Cleanup completed successfully',
        deleted: expiredWebhooks.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in cleanup cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
