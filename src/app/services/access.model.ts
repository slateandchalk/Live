export interface Access {
    role: Roles;
}

export interface Roles {
    admin: boolean;
    head: boolean;
    pa: boolean;
    principal: boolean;
}