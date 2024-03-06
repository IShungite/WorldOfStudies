export default function isLogged() {
    try {
        const token = localStorage.getItem("token");
        if (token) return true;
    } catch {
        return false;
    }
    
}