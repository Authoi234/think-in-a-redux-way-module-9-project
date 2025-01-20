import { useSelector } from "react-redux";
import Message from "./Message";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Messages({ messages = [], fetchMore, hasMore }) {
    const { user } = useSelector((state) => state.auth) || {};
    const { email } = user || {};

    return (
        <div className="w-full">
            <div className="relative w-full p-6overflow-y-auto h-[calc(100vh_-_200px)]  flex flex-col-reverse">
                <ul className="space-y-2">
                    <InfiniteScroll
                        dataLength={messages.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        inverse={true}
                        loader={<h4>Loading...</h4>}
                        height={window.innerHeight - 200}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    >
                        {messages
                            .slice()
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((message) => {
                                const {
                                    message: lastMessage,
                                    id,
                                    sender,
                                } = message || {};

                                const justify =
                                    sender.email !== email ? "start" : "end";

                                return (
                                    <Message
                                        key={id}
                                        justify={justify}
                                        message={lastMessage}
                                    />
                                );
                            })}
                    </InfiniteScroll>
                </ul>
            </div>
        </div>
    )

}
