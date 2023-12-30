import Collections from "@/components/Collections";
import FriendsList from "@/components/FriendsList";
import { GridContainer } from "@/components/Homepage/styled";
import InviteList from "@/components/InviteList";
import Player from "@/components/Player";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import { getUser, setUser } from "@/components/Signup/redux/slice";
import Layout from "@/layout";
import { Grid } from "@mui/material";
import {Helmet} from "react-helmet";
import { useSelector } from "react-redux";

export default function Dashboard() {

    const user = useSelector(getUser)

    const checkUserLogin = () => {
        return !localStorage.getItem('apiToken') || !user
    }


    return (
        <Layout noAccess={checkUserLogin()}>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <GridContainer container columnSpacing={3}>
                <Grid item lg={3} sx={{height: '100%'}} justifyContent={'space-between'} alignItems={'center'}>
                    <FriendsList />
                    <InviteList />
                </Grid>
                <Grid item lg={6}>
                    <Player />
                </Grid>
                <Grid item lg={3}>
                    <RecentlyPlayed />
                    <Collections />
                </Grid>
            </GridContainer>
        </Layout>
    )
}