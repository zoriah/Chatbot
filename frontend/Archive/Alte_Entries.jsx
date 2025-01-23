import axios from "axios"
import { useState } from "react"

const Entries = () => {
    const [formData, setFormData] = useState({
        content: "",
        title: "",
        author: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("http://localhost:8080/entries", formData)
            alert("Entrie created")
        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData, [name]: value
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={formData.title} onChange={handleChange} />
                <input type="text" name="content" value={formData.content} onChange={handleChange} />
                <input type="text" name="author" value={formData.author} onChange={handleChange} />
                <button type="submit">send</button>
            </form>
        </div>
    )
}

export default Entries;