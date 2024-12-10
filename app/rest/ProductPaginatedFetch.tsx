import { useQuery } from '@tanstack/react-query';

const fetchData = async ({ queryKey }) => {
    const [, page] = queryKey;
    const response = await fetch(`/api/products?page=${page}&limit=50`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const PaginatedDataList = ({ page, findPage, setDataItems }) => {

    const { data, isError, error } = useQuery({
        queryKey: ['items', page],
        queryFn: fetchData,
        initialData: { items: [] }
    });

    if (isError) {
        setDataItems({ success: false, error: error });
    } else {
        setDataItems({ success: true, content: data.items });
    }
}

