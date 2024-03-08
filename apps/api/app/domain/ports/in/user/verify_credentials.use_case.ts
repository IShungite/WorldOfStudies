import { User } from '#domainModels/user/user'

export interface VerifyCredentialsUseCase {
  verifyCredentials(email: string, password: string): Promise<User>
}
