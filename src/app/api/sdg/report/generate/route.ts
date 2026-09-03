import { NextResponse } from 'next/server';
import { processReportGeneration } from '@/lib/reports/generator';
import { ProjectData } from '@/lib/ai/analyzer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project_id, report_version = "1.0", project_data } = body;

    if (!project_id || !project_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Generate unique report ID
    const report_id = crypto.randomUUID();

    // 2. Create database record
    const { error } = await supabase
      .from('reports')
      .insert([
        {
          id: report_id,
          project_id,
          version: report_version,
          status: 'queued'
        }
      ]);

    if (error) {
      console.error("DB Insert Error:", error);
      // Fallback if table doesn't exist yet, we still proceed but warn
    }

    // 3. Trigger async generation process
    // In a production serverless environment (e.g. Vercel), this might be killed early.
    // For robust production, use a background job system (like Inngest or QStash).
    // For standard Node.js or simulated async, we fire and forget:
    processReportGeneration(project_id, report_id, project_data as ProjectData, report_version)
      .catch(console.error);

    // 4. Return immediately to the client
    return NextResponse.json({
      success: true,
      report_id,
      status: "queued",
      created_at: new Date().toISOString(),
      report_version
    });

  } catch (error: unknown) {
    console.error('Failed to initiate report generation:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
