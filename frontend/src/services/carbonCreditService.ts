import axios from "../lib/axios"

export const getImpactStats = async () => {
    try {
        const response = await axios.get("/carbon-credits/stats")
        return response
    } catch (error) {
        console.log(error)
    }
}

export const getOwnedCredit = async (ownedId: string) => {
    try {
        const response = await axios.get(`/carbon-credits/wallet/${ownedId}`)
        return response
    } catch (error) {
        console.log(error)
    }
}