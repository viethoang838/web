export async function GET(request, {params}){
    // lay chi tiet
    let userList = [
            {id:1, name:"Cuong", email:"a1@gmail.com"},
            {id:2, name:"Hoang", email:"a2@gmail.com"},
            {id:3, name:"Duc", email:"a3@gmail.com"},
            {id:4, name:"Nam", email:"a4@gmail.com"},
            {id:5, name:"Thao", email:"a5@gmail.com"},
            {id:6, name:"Hung", email:"a6@gmail.com"},
            {id:7, name:"Trang", email:"a7@gmail.com"},
        ];
        // lay chi tiet user theo id truyen vao 
        const {id} = await params;

        const user = userList.find(u=>u.id==id);
        if(user){
            return Response.json(user);
        }
        return Response.json({message:"Khong itm thay thong tin nguoi dung"});
}
export async function PUT(request, {params}){
    // sua thong tin
}
export async function PATCH(request, {params}){
    // 
}
export async function DELETE(request, {params}){
    //xoa user
}