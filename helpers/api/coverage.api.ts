import { Page, expect } from '@playwright/test';

const GRAPHQL_API = 'https://dev-x.cortexcloud.co/cortex-api/graphql';

const MANAGE_COVERAGE_MUTATION = `
  mutation ManagePatientCoverageDocuments($input: ManagePatientCoverageDocumentsInput!) {
    managePatientCoverageDocuments(input: $input) {
      id
      hn
      active
      startEffectiveDate
      endEffectiveDate
      insurancePlan {
        id
        info { th { name } }
      }
      value
    }
  }
`;

/**
 * Assign สิทธิ์การรักษา (coverage) ให้คนไข้ผ่าน GraphQL API
 */
export async function assignPatientCoverageViaAPI(
  page: Page,
  token: string,
  hn: string,
  insurancePlanId: number,
  value = '123'
): Promise<any> {
  const response = await page.request.post(GRAPHQL_API, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data: {
      query: MANAGE_COVERAGE_MUTATION,
      variables: {
        input: {
          hn,
          patientCoverageDocuments: [{
            id: null,
            insurancePlanId,
            value,
            startEffectiveDate: null,
            endEffectiveDate: null,
            active: true,
          }],
        },
      },
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`assignPatientCoverageViaAPI failed [${response.status()}]: ${body}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data?.managePatientCoverageDocuments;
}
