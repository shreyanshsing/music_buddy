import NoAccess from "@/components/UIComponents/NoAccess";
import { GridContainer } from "./styled";

export default function Layout({ children, noAccess }: { children: React.ReactNode, noAccess?: boolean }) {
    return (
        <GridContainer>
            {
                noAccess ? <NoAccess /> : children
            }
        </GridContainer>
    )
}