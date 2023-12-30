import Layout from "@/layout";
import { Typography } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';

export default function NoAccess() {
    return (
        <Layout>
            <div style={{margin: '2rem auto'}}>
                <Typography sx={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}} variant={'h4'} gutterBottom>
                    No Access
                    <BlockIcon fontSize={'large'} />
                </Typography>
                <Typography sx={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}} variant={'h6'}>You don't have access to this page</Typography>
            </div>
        </Layout>
    )
}