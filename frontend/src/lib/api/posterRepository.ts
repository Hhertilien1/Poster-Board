import * as httpRepository from "@/lib/api/posterRepository.http";

export const posterRepository = {
  listPosters: httpRepository.listPosters,
  listUsers: httpRepository.listUsers,
  getPosterById: httpRepository.getPosterById,
  createPoster: httpRepository.createPoster,
  getUserById: httpRepository.getUserById,
  getUserByUsername: httpRepository.getUserByUsername,
  searchUsers: httpRepository.searchUsers,
  createUser: httpRepository.createUser
};
