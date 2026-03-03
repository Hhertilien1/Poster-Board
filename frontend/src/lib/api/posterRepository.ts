import * as httpRepository from "@/lib/api/posterRepository.http";

export const posterRepository = {
  listPosters: httpRepository.listPosters,
  getPosterById: httpRepository.getPosterById
};