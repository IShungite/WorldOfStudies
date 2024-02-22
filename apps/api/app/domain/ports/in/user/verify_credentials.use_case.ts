import { User } from '#domainModels/user'

export interface VerifyCredentialsUseCase {
  verifyCredentials(email: string, password: string): Promise<User>
}
