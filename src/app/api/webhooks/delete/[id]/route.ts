import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    // Delete webhook (events will be cascaded automatically)
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting webhook:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete webhook' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Webhook deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in delete webhook API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
