export class PermissionType {
     name: string[]=[];
     constructor(data: PermissionType){
     if(data){
            this.name = data.name;
        }
    }
}
