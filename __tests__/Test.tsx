import { render } from '@testing-library/react-native';

import Index from '@/app/index';

describe('Index & Log In', () => {
    test("Renders text correctly", () => {
        const { getByText } = render(<Index />);

        getByText("Log In");
    })
})