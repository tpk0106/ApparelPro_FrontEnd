export default interface User {
  email: string;
  knownAs: string;
  password: string;
  confirmPassword: string;
  gender: string;
  city: string;
  country: string;
  Photo: BinaryType;
  DateOfBirth: Date;
}
