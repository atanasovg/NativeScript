import textModule = require("text");
import utils = require("utils/utils");
import * as typesModule from "utils/types";

let mscorlib = requireAssembly("mscorlib");

export class FileSystemAccess {
    private _pathSeparator = "/";

    public getLastModified(path: string): Date {
        // var javaFile = new java.io.File(path);
        // return new Date(javaFile.lastModified());
        return new Date();
    }

    public getParent(path: string, onError?: (error: any) => any): { path: string; name: string } {
        try {
            var javaFile = new java.io.File(path);
            var parent = javaFile.getParentFile();

            return { path: parent.getAbsolutePath(), name: parent.getName() };
        } catch (exception) {
            // TODO: unified approach for error messages
            if (onError) {
                onError(exception);
            }

            return undefined;
        }
    }

    public getFile(path: string, onError?: (error: any) => any): { path: string; name: string; extension: string } {
        return this.ensureFile(path, false, onError);
    }

    public getFolder(path: string, onError?: (error: any) => any): { path: string; name: string } {
        var dirInfo = this.ensureFile(path, true, onError);
        if (!dirInfo) {
            return undefined;
        }

        return { path: dirInfo.path, name: dirInfo.name };
    }

    public eachEntity(path: string, onEntity: (file: { path: string; name: string; extension: string }) => boolean, onError?: (error: any) => any) {
        if (!onEntity) {
            return;
        }

        this.enumEntities(path, onEntity, onError);
    }

    public getEntities(path: string, onError?: (error: any) => any): Array<{ path: string; name: string; extension: string }> {
        var fileInfos = new Array<{ path: string; name: string; extension: string }>();
        var onEntity = function (entity: { path: string; name: string; extension: string }): boolean {
            fileInfos.push(entity);
            return true;
        }

        var errorOccurred;
        var localError = function (error: any) {
            if (onError) {
                onError(error);
            }

            errorOccurred = true;
        }

        this.enumEntities(path, onEntity, localError);

        if (!errorOccurred) {
            return fileInfos;
        }

        return null;
    }

    public fileExists(path: string): boolean {
        return global.__native.file.Exists(path);
    }

    public folderExists(path: string): boolean {
        return global.__native.file.IsDir(path);
    }

    public deleteFile(path: string, onError?: (error: any) => any) {
        try {
            var javaFile = new java.io.File(path);
            if (!javaFile.isFile()) {
                if (onError) {
                    onError({ message: "The specified parameter is not a File entity." });
                }

                return;
            }

            if (!javaFile.delete()) {
                if (onError) {
                    onError({ message: "File deletion failed" });
                }
            }
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    public deleteFolder(path: string, onError?: (error: any) => any) {
        try {
            var javaFile = new java.io.File(path);
            if (!javaFile.getCanonicalFile().isDirectory()) {
                if (onError) {
                    onError({ message: "The specified parameter is not a Folder entity." });
                }

                return;
            }

            // TODO: Asynchronous
            this.deleteFolderContent(javaFile);

            if (!javaFile.delete()) {
                if (onError) {
                    onError({ message: "Folder deletion failed." });
                }
            }
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    public emptyFolder(path: string, onError?: (error: any) => any) {
        try {
            var javaFile = new java.io.File(path);
            if (!javaFile.getCanonicalFile().isDirectory()) {
                if (onError) {
                    onError({ message: "The specified parameter is not a Folder entity." });
                }

                return;
            }

            // TODO: Asynchronous
            this.deleteFolderContent(javaFile);
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    public rename(path: string, newPath: string, onError?: (error: any) => any) {
        var javaFile = new java.io.File(path);
        if (!javaFile.exists()) {
            if (onError) {
                onError(new Error("The file to rename does not exist"));
            }

            return;
        }

        var newFile = new java.io.File(newPath);
        if (newFile.exists()) {
            if (onError) {
                onError(new Error("A file with the same name already exists."));
            }

            return;
        }

        if (!javaFile.renameTo(newFile)) {
            if (onError) {
                onError(new Error("Failed to rename file '" + path + "' to '" + newPath + "'"));
            }
        }
    }

    public getDocumentsFolderPath(): string {
         return "./js/documents/";
    }

    public getLogicalRootPath(): string {
         return "./js/app/";
    }

    public getTempFolderPath(): string {
         return "./js/app/";
    }
    
    public getCurrentAppPath(): string {
         return "./js/app/";
    }

    public read(path: string, onError?: (error: any) => any) {
        try {
            var javaFile = new java.io.File(path);
            var stream = new java.io.FileInputStream(javaFile);
            var bytes = (<any>Array).create("byte", javaFile.length());
            var dataInputStream = new java.io.DataInputStream(stream);
            dataInputStream.readFully(bytes);
            return bytes;
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    public write(path: string, bytes: native.Array<number>, onError?: (error: any) => any) {
        try {
            var javaFile = new java.io.File(path);
            var stream = new java.io.FileOutputStream(javaFile);
            stream.write(bytes, 0, bytes.length);
            stream.close();
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    public readText(path: string, onError?: (error: any) => any, encoding?: any) {
        try {
            return global.__native.file.ReadFile(path);
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    private static _removeUtf8Bom(s: string): string {
        if (s.charCodeAt(0) === 0xFEFF) {
            s = s.slice(1);
            //console.log("Removed UTF8 BOM.");
        }

        return s;
    }

    public writeText(path: string, content: string, onError?: (error: any) => any, encoding?: any) {
        try {
            var javaFile = new java.io.File(path);
            var stream = new java.io.FileOutputStream(javaFile);

            var actualEncoding = encoding;
            if (!actualEncoding) {
                actualEncoding = textModule.encoding.UTF_8;
            }
            var writer = new java.io.OutputStreamWriter(stream, actualEncoding);

            writer.write(content);
            writer.close();
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    private deleteFolderContent(file: java.io.File): boolean {
        var filesList = file.listFiles();
        if (filesList.length === 0) {
            return true;// Nothing to delete, so success!
        }

        var i,
            childFile: java.io.File,
            success: boolean = false;

        for (i = 0; i < filesList.length; i++) {
            childFile = filesList[i];
            if (childFile.getCanonicalFile().isDirectory()) {
                success = this.deleteFolderContent(childFile);
                if (!success) {
                    break;
                }
            }

            success = childFile.delete();
        }

        return success;
    }

    private ensureFile(path: string, isFolder: boolean, onError?: (error: any) => any): { path: string; name: string; extension: string } {
        try {
            let ext = global.__native.file.GetExtension(path);
            let name = global.__native.file.GetName(path);
            return { path: path, name: name, extension: ext };
        } catch (exception) {
            // TODO: unified approach for error messages
            if (onError) {
                onError(exception);
            }

            return undefined;
        }
    }

    // TODO: This method is the same as in the iOS implementation.
    // Make it in a separate file / module so it can be reused from both implementations.
    private getFileExtension(path: string): string {
        var dotIndex = path.lastIndexOf(".");
        if (dotIndex && dotIndex >= 0 && dotIndex < path.length) {
            return path.substring(dotIndex);
        }

        return "";
    }

    private enumEntities(path: string, callback: (entity: { path: string; name: string; extension: string }) => boolean, onError?: (error) => any) {
        try {
            var javaFile = new java.io.File(path);
            if (!javaFile.getCanonicalFile().isDirectory()) {
                if (onError) {
                    onError("There is no folder existing at path " + path);
                }

                return;
            }

            var filesList = javaFile.listFiles();
            var length = filesList.length;
            var i;
            var info;
            var retVal;

            for (i = 0; i < length; i++) {
                javaFile = filesList[i];

                info = {
                    path: javaFile.getAbsolutePath(),
                    name: javaFile.getName()
                };

                if (javaFile.isFile()) {
                    info.extension = this.getFileExtension(info.path);
                }

                retVal = callback(info);
                if (retVal === false) {
                    break;
                }
            }
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    }

    public getPathSeparator(): string {
        return this._pathSeparator;
    }

    public normalizePath(path: string): string {
        return path;
    }

    public joinPath(left: string, right: string): string {
         return left + this._pathSeparator + right;
    }

    public joinPaths(paths: string[]): string {
        if (!paths || paths.length === 0) {
            return "";
        }

        if (paths.length === 1) {
            return paths[0];
        }

        var i,
            result = paths[0];
        for (i = 1; i < paths.length; i++) {
            result = this.joinPath(result, paths[i]);
        }

        return this.normalizePath(result);
    }
}