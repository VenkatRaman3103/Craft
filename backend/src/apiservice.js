import axios from "axios";

export async function fetchUser(id) {
    const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`,
    );
    return response.data;
}
