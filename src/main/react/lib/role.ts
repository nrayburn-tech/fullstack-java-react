export function hasRole(role: string, authRoles?: string[]): boolean {
  if (!authRoles) {
    return false;
  }
  return !!authRoles.find((authRole) => {
    return authRole.toLowerCase() === role.toLowerCase();
  });
}
