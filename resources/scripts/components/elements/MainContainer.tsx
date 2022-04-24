import styled from 'styled-components/macro';

const MainContainer = styled.div`
    & {
        padding-left: 250px;
    }

    @media (max-width: 1000px) {
        & {
            padding-left: 50px;
        }
    }
`;
export default MainContainer;
