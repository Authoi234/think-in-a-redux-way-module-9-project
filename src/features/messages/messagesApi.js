import socket from "../../utils/socketInstance";
import { apiSlice } from "../api/apiSlice";
import { store } from '../../app/store';

const getUserEmail = () => {
    const state = store.getState();  // Get the current state of the Redux store
    return state.auth.user?.email || '';  // Assuming your auth slice has a user field with an email
};


export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (id) => `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=11`,
            transformResponse(apiResponse, meta) {
                const totalCount = meta.response.headers.get("X-Total-Count");
                return {
                    data: apiResponse,
                    totalCount,
                };
            },
            async onCacheEntryAdded(
                args,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;

                    socket.on("message", (data) => {
                        updateCachedData((draft) => {
                            const currentUserEmail = getUserEmail();
                            if (data?.data?.sender?.email !== currentUserEmail) {
                                draft.data.push(data.data);
                            }
                        });

                    });
                } catch (err) {

                }

                await cacheEntryRemoved;
                socket.close();
            },
        }),
        getMoreMessages: builder.query({
            query: ({ id, page }) => `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=${page}&_limit=11`,
            async onQueryStarted({ id, page }, { queryFulfilled, dispatch }) {
                try {
                    const messages = await queryFulfilled;
                    if (messages?.data?.length > 0) {
                        dispatch(
                            apiSlice.util.updateQueryData(
                                "getMessages",
                                id,
                                (draft) => {
                                    return {
                                        data: [
                                            ...draft.data,
                                            ...messages.data,
                                        ],
                                        totalCount: Number(draft.totalCount),
                                    };
                                }
                            )
                        );
                    }
                } catch (err) { }
            },
        }),
        addMessage: builder.mutation({
            query: (data) => ({
                url: "/messages",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useGetMessagesQuery, useAddMessagesMutation } = messagesApi;
