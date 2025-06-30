interface UserEmailResponse {
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users(userPrincipalName)/$entity';
    userPrincipalName: string;
};

interface SecurityGroupData {
    id: string;
    deletedDateTime?: string;
    classification?: string;
    createdDateTime?: string;
    creationOptions: any[];
    description?: string;
    displayName: string;
    expirationDateTime?: string;
    groupTypes: string[];
    isAssignableToRole?: string;
    mail?: string;
    mailEnabled: boolean;
    mailNickname: string;
    membershipRule?: string;
    membershipRuleProcessingState?: string;
    onPremisesDomainName?: string;
    onPremisesLastSyncDateTime?: string;
    onPremisesNetBiosName?: string;
    onPremisesSamAccountName?: string;
    onPremisesSecurityIdentifier?: string;
    onPremisesSyncEnabled?: boolean;
    preferredDataLocation?: string;
    preferredLanguage?: string;
    proxyAddresses: string[];
    renewedDateTime: string;
    resourceBehaviorOptions: any[];
    resourceProvisioningOptions: any[];
    securityEnabled: boolean;
    securityIdentifier: string;
    uniqueName?: string;
    visibility?: string;
    onPremisesProvisioningErrors: any[];
    serviceProvisioningErrors: any[];
}

interface SecurityGroupsResponse {
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#groups';
    '@odata.nextLink': string;
    value: SecurityGroupData[];
};

interface ErrorResponse {
    '@odata.context': undefined;
    error: {
        code: string;
        message: string;
        innerError: {
            date: string;
            'request-id': string;
            'client-request-id': string;
        }
    }
}

export type MicrosoftGraphApiResponse = UserEmailResponse | SecurityGroupsResponse | ErrorResponse;

export function isUserEmailResponse(res: MicrosoftGraphApiResponse): res is UserEmailResponse {
    return res['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#users(userPrincipalName)/$entity';
}

export function isSecurityGroupsResponse(res: MicrosoftGraphApiResponse): res is SecurityGroupsResponse {
    return res['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#groups';
}

export function isErrorResponse(res: MicrosoftGraphApiResponse): res is ErrorResponse {
    return 'error' in res;
}