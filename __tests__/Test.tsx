import { render } from '@testing-library/react-native';

import Index from '@/app/index';

describe('Index', () => {
    test("Renders text correctly", () => {
        const { getByText } = render(<Index />);

        getByText("Edit app/index.tsx to edit this screen.");
    })
})