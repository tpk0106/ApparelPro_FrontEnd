export interface loginResponse {
  email: string;
  token: string;
  refreshToken: string;
  knownAs: string;
  photo: BinaryType;
  success: boolean;
}
