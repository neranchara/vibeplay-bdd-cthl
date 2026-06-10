import { Page } from '@playwright/test';

const GRAPHQL_API = 'https://dev-x.cortexcloud.co/cortex-api/graphql';

export interface InsurancePlan {
  id: number;
  code: string;
  patientType?: string;   // 'OPD' | 'IPD' | null — ถ้า API มี field นี้
  type?: string;          // alternative field name
  category?: string;      // alternative field name
  info: { th: { name: string } };
}

export async function getInsurancePlans(page: Page, token: string): Promise<InsurancePlan[]> {
  const response = await page.request.post(GRAPHQL_API, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data: {
      query: `
        query GetInsurancePlans {
          insurancePlans {
            id
            code
            patientType
            type
            category
            info { th { name } }
          }
        }
      `,
    },
  });

  const data = await response.json();
  if (data.errors) throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  return data.data?.insurancePlans ?? [];
}
