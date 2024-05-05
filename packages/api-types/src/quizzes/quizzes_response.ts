import { PaginatedResponse } from "../pagination/paginated_response";
import { Quiz } from "./quiz";

export type QuizzesResponse = PaginatedResponse<Quiz>;
