import { ChangeEvent, useState } from "react"

export const useForm =<T extends object> (initState:T) => {



    const [formulario, setFormulario] = useState(initState)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        })
    }

    return {
        formulario,
        setFormulario,
        handleChange
    }

}

