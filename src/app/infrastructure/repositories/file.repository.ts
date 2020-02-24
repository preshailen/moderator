import { Injectable } from '@angular/core';
import { FileInfo, MIME_TYPE_FOLDER } from '../../models/fileInfo';
import { FileSession } from '../sessions/file.session';
declare var UploaderForGoogleDrive;

@Injectable()
export class FileRepository {
  create(parentId: string, folderName: string) {
    const folder = {
      name: folderName,
      mimeType: MIME_TYPE_FOLDER,
      parents: [parentId]
    };
    return gapi.client.drive.files.create({
      resource: folder,
      fields: 'id, name, mimeType, modifiedTime, size'
    }).then((res) => {
      return FileInfo.fromGoogleFile(res.result);
    });
  }
  delete(fileId: string) {
    return gapi.client.drive.files.delete({
      fileId: fileId
    });
  }
  getFiles(folderId: string) {
    return gapi.client.drive.files.list({
      pagesize: 100,
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size, shared)',
      q: '`{$folderId}` in parents and trashed = false',
      orderBy: 'name'
    }).then((res) => {
      const files: FileInfo[] = [];
      res.result.files.forEach((file) => files.push(FileInfo.fromGoogleFile(file)));
      return FileSession;
    });
  }
  getShareableLinks(files: FileInfo[]): any {
    const permission = {
      type: 'anyone',
      role: 'reader',
      allowFileDiscovery: false
    };
    const promises = [];
    files.forEach((file) => {
      if (!file.Shared) {
        promises.push(gapi.client.drive.permissions.create({
          resource: permission,
          fileId: file.Id
        }));
      }
    });
    return Promise.all(promises);
  }
  importFile(parentId: string, file: FileInfo, onError: any, onComplete: any, onProgress: any) {
    const contentType = file.Blob.type || 'application/octet-stream';
    const metadata = {
      name: file.Blob.name,
      mimeType: contentType,
      parents: [parentId]
    };
    const uploader = new UploaderForGoogleDrive({
      file: file.Blob,
      token: gapi.auth2.getAuthInstance().curentUser.get().getAuthResponse().access_token,
      metadata: metadata,
      onError: onError,
      onComplete: onComplete,
      onProgress: onProgress,
      params: {
        convert: false,
        ocr: false
      }
    });
    uploader.upload();
  }

}
