if(!sessionStorage.user){
    noty({"text":"You have to login","layout":"center","type":"error"});  
    setTimeout(()=>{
        window.location.href = "login.html";}, 1000);               
}
