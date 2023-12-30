import type { ReactNode } from "react";
import styled from '@emotion/styled';

const HomepageBorderAnimation = styled.div`
    --border-size: 3px;
    --border-angle: 0turn;
    padding: 2rem;
    background-image: conic-gradient(
        from var(--border-angle),
        #6a4ea0,
        #6a4ea0,
        #6a4ea0
    ),
    conic-gradient(from var(--border-angle), transparent 20%, white);
    background-size: calc(100% - (var(--border-size) * 2))
        calc(100% - (var(--border-size) * 2)),
    cover;
    background-position: center;
    background-repeat: no-repeat;
    animation: bg-spin 2s linear infinite;
    @keyframes bg-spin {
        to {
            --border-angle: 1turn;
        }
    }
    @property --border-angle {
        syntax: "<angle>";
        inherits: true;
        initial-value: 0turn;
    }
`

export function DelayedBorder({children}: {children: ReactNode}) {
    return (
        <HomepageBorderAnimation className={'homepage-border-animation'}>
            {children}
        </HomepageBorderAnimation>
    )
}