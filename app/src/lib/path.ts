import * as fileUrl from 'file-url';
import * as path from 'path';

export function toFileUrl(...pathSegments: string[]): string {
  const filePath = path.resolve(...pathSegments);
  return fileUrl(filePath);
}
