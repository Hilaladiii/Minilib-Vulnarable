export function isTokenExpired(exp: number) {
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
}
