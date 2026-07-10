import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('http://localhost:8000/api/chat', async ({ request }) => {
    // Read the request payload
    const body = await request.json() as { message: string, context: any };
    
    // Simulate successful backend interaction parsing (with snake_case)
    if (body.message === 'trigger success') {
      return HttpResponse.json({
        response: 'Interaction logged successfully.',
        interaction_data: {
          hcp_name: 'Dr. Jane Doe',
          hospital: 'Mock Hospital',
          interaction_type: 'Email',
          interaction_date: '2024-05-01',
          topics_discussed: 'New Trial',
          sentiment: 'Positive',
          summary: 'Sent trial information',
          outcomes: 'Pending review',
          action_items: ['Follow up in a week'],
          attendees: ['Dr. Jane Doe']
        }
      });
    }

    // Simulate backend throwing a 500 internal server error
    if (body.message === 'trigger 500 error') {
      return new HttpResponse(JSON.stringify({ detail: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default response
    return HttpResponse.json({ response: 'Default mock response' });
  }),
];
