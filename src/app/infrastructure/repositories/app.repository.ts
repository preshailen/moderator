import { Injectable } from '@angular/core';
import { UserRepository } from './user.respository';
import { FileRepository } from './file.repository';
import { createCipher } from 'crypto';

@Injectable()
export class AppRepository {
  constructor(private fileRepository: FileRepository, private userRepository: UserRepository) {}
  get File(): FileRepository {
    return this.fileRepository;
  }
  get User(): UserRepository {
    return this.userRepository;
  }
}
