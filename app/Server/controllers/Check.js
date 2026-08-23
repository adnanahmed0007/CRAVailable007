const check = (req, res) => {
    if (req.user) {

        console.log("User session valid for:", req.user.email);
        return res.json({ loggedIn: true });
    }
    return res.json({ loggedIn: false });
};

export default check;
