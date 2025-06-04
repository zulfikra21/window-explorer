export function fetcher(path: string, method: string, body: any) {
    let base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/v1';
    return fetch(`${base_url}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body:(body) ? JSON.stringify(body) : undefined
    }).then(res => res.json())  
}