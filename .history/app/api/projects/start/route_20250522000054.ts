import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to generate a slug (simplified version)
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word [a-zA-Z0-9_], non-whitespace, non-hyphen characters
    .replace(/\s+/g, '-') // replace whitespaces with hyphens
    .replace(/--+/g, '-') // replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
};

// Helper function to generate a token ticker (simplified version)
const generateTicker = (projectName: string): string => {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with']);
  const words = projectName.toLowerCase().split(/\s+/).filter(word => word.length > 0 && !commonWords.has(word));
  let ticker = '';
  if (words.length === 0 && projectName.length > 0) {
    ticker = projectName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
  } else if (words.length === 1) {
    ticker = words[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
  } else {
    for (const word of words) {
      if (ticker.length < 5 && word.length > 0) {
        ticker += word.charAt(0);
      }
      if (ticker.length === 5) break;
    }
    if (ticker.length < 5 && words.length > 0) {
      ticker = (ticker + words[0].substring(1)).replace(/[^a-zA-Z0-9]/g, '');
      ticker = ticker.substring(0,5);
    }
  }
  return '$' + ticker.padEnd(5, 'X').substring(0,5).toUpperCase();
};

interface NewProjectAPIRequest {
  name: string;
  project_brief?: string;
  what_to_build?: string;
  desired_domain_name?: string;
  website_url?: string; // This might be more for an existing site, or desired final URL
  logo_url?: string;
  requested_budget?: string | number;
  project_type?: string;
  socialLinks?: { [key: string]: string };
  inspiration_links?: string;
  how_heard?: string;
  addProjectTeam: boolean;
  addProjectToken: boolean;
  addProjectAgent: boolean;
  addProjectWebsite: boolean;
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let reqBody: NewProjectAPIRequest;
  try {
    reqBody = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    name: projectName,
    project_brief,
    // what_to_build,
    // desired_domain_name,
    // website_url,
    // logo_url,
    // requested_budget,
    // project_type,
    // socialLinks,
    // inspiration_links,
    // how_heard,
    addProjectTeam,
    addProjectToken,
    addProjectAgent,
    addProjectWebsite,
  } = reqBody;

  if (!projectName || typeof projectName !== 'string' || projectName.trim() === '') {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
  }

  const projectSlug = generateSlug(projectName);

  try {
    // 1. Get or Create Client Record
    let clientId: string;
    const { data: existingClient, error: clientFetchError } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (clientFetchError && clientFetchError.code !== 'PGRST116') { // PGRST116: "single row not found"
      console.error('Error fetching client:', clientFetchError);
      return NextResponse.json({ error: 'Failed to retrieve client information.' }, { status: 500 });
    }

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      // Create a new client if one doesn't exist for this user
      // You might want to pull more details from the user's profile or request body
      const { data: newClient, error: clientInsertError } = await supabase
        .from('clients')
        .insert({ 
          user_id: user.id, 
          name: user.email || 'New Client', // Placeholder name
          email: user.email,
          project_slug: projectSlug, // Or a general client slug
        })
        .select('id')
        .single();
      
      if (clientInsertError || !newClient) {
        console.error('Error creating client:', clientInsertError);
        return NextResponse.json({ error: 'Failed to create client record.' }, { status: 500 });
      }
      clientId = newClient.id;
    }

    // 2. Create Project Record
    const { data: newProject, error: projectError } = await supabase
      .from('projects')
      .insert({
        client_id: clientId,
        name: projectName,
        slug: projectSlug,
        description: project_brief,
        // Add other project fields as needed from reqBody
      })
      .select('id, slug')
      .single();

    if (projectError || !newProject) {
      console.error('Error creating project:', projectError);
      return NextResponse.json({ error: 'Failed to create project.', details: projectError?.message }, { status: 500 });
    }

    const projectId = newProject.id;

    // 3. Conditional Creation of Associated Entities
    if (addProjectTeam) {
      const teamName = `${projectName} Team`;
      const teamSlug = generateSlug(teamName);
      const { error: teamError } = await supabase.from('teams').insert({
        project_id: projectId,
        name: teamName,
        slug: teamSlug,
        created_by: user.id,
        description: `Team for the project: ${projectName}`,
      });
      if (teamError) console.error('Error creating team:', teamError.message); // Log and continue
    }

    if (addProjectToken) {
      const tokenName = `${projectName} Token`;
      const tokenTicker = generateTicker(projectName);
      const { error: tokenError } = await supabase.from('tokens').insert({
        project_id: projectId,
        user_id: user.id, // Assuming the project creator is the token owner
        token_category: 'project',
        name: tokenName,
        ticker_symbol: tokenTicker,
        total_supply: 1000000, // Default supply, make configurable if needed
        dividend_bearing: false,
      });
      if (tokenError) console.error('Error creating token:', tokenError.message); // Log and continue
    }

    if (addProjectAgent) {
      const agentName = `${projectName} Agent`;
      const { error: agentError } = await supabase.from('project_agents').insert({
        project_id: projectId,
        name: agentName,
        type: 'default', // Or make configurable
      });
      if (agentError) console.error('Error creating project agent:', agentError.message); // Log and continue
    }

    if (addProjectWebsite) {
      const { error: websiteError } = await supabase.from('project_websites').insert({
        project_id: projectId,
        url: reqBody.desired_domain_name || `https://${projectSlug}.b0ase.com`, // Example URL
      });
      if (websiteError) console.error('Error creating project website:', websiteError.message); // Log and continue
    }

    return NextResponse.json({ message: 'Project created successfully!', project: newProject }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error in /api/projects/start:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
} 