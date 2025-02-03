"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Repeat2, Heart } from "lucide-react"

const tweets = [
  {
    author: "CryptoNews",
    handle: "@crypto_news",
    avatar: "/crypto-news-avatar.png",
    content:
      "Bitcoin reaches new all-time high! The cryptocurrency market is buzzing with excitement. #Bitcoin #CryptoMoon",
    time: "2h ago",
    replies: 45,
    retweets: 128,
    likes: 502,
    tags: ["Bitcoin", "CryptoMoon"],
  },
  {
    author: "ETH Foundation",
    handle: "@ethereum",
    avatar: "/eth-foundation-avatar.png",
    content:
      "Ethereum 2.0 upgrade scheduled for next month. Get ready for improved scalability and reduced energy consumption! #Ethereum #ETH2",
    time: "4h ago",
    replies: 89,
    retweets: 256,
    likes: 1024,
    tags: ["Ethereum", "ETH2"],
  },
  {
    author: "DeFi Watch",
    handle: "@defi_watch",
    avatar: "/defi-watch-avatar.png",
    content:
      "New DeFi protocol launches with $100M TVL in just 24 hours! The DeFi space continues to innovate at breakneck speed. #DeFi #CryptoInnovation",
    time: "6h ago",
    replies: 32,
    retweets: 76,
    likes: 301,
    tags: ["DeFi", "CryptoInnovation"],
  },
]

export function Tweets() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-yellow-600/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-yellow-900">Latest Crypto Tweets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tweets.map((tweet, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarImage src={tweet.avatar} />
                  <AvatarFallback>{tweet.author[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{tweet.author}</p>
                    <p className="text-sm text-muted-foreground">{tweet.handle}</p>
                    <p className="text-sm text-muted-foreground">· {tweet.time}</p>
                  </div>
                  <p className="text-sm">{tweet.content}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tweet.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">{tweet.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Repeat2 className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">{tweet.retweets}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">{tweet.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}