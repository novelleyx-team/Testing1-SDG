import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadReportToStorage(projectId: string, reportId: string, pdfBuffer: Buffer): Promise<string> {
  const filePath = `${projectId}/${reportId}/report.pdf`;
  
  const { data, error } = await supabase
    .storage
    .from('sdg-reports')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from('sdg-reports')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function updateReportStatus(reportId: string, status: string, pdfUrl?: string, scores?: any) {
  const updateData: any = { status };
  if (pdfUrl) updateData.pdf_url = pdfUrl;
  if (scores) updateData.scores = scores;

  const { error } = await supabase
    .from('reports')
    .update(updateData)
    .eq('id', reportId);

  if (error) {
    console.error("Failed to update report status in DB:", error);
  }
}
