import socket from "../../utils/socketInstance";
import { apiSlice } from "../api/apiSlice";
import {store} from '../../app/store';

const getUserEmail = () => {
    const state = store.getState();  // Get the current state of the Redux store
    return state.auth.user?.email || '';  // Assuming your auth slice has a user field with an email
};


export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (id) => `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
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
                                draft.push(data.data);
                            }
                        });

                    });
                } catch (err) {

                }

                await cacheEntryRemoved;
                socket.close();
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
