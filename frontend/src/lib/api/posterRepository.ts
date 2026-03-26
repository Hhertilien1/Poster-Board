import * as httpRepository from "@/lib/api/posterRepository.http";

export const posterRepository = {
  listPosters: httpRepository.listPosters,
  getPosterById: httpRepository.getPosterById,
  createPoster: httpRepository.createPoster,
  getUserById: httpRepository.getUserById,
  createUser: httpRepository.createUser
};
