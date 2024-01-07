import jwt from 'jsonwebtoken'

// This function is to check whether the admin is (still) logged in
// so no one can do changes without authorization
// First after the authorization is verified, the controller (/controllers/user.js) takes over

const auth = async (req, res, next) => {
    try {
        const token = req.get("Authorization").split(" ")[1]
        const isCustomAuth = token.length < 500

        let decodedData

        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'henry')
            req.userId = decodedData?.id
        } else {
            decodedData = jwt.decode(token)

            req.userId = decodedData?.sub
        }

        next()

    } catch (error) {
        console.log(error)
    }
}

export default auth