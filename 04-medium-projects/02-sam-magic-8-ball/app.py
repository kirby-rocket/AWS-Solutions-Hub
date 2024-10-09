import random
import json

def lambda_handler(event, context):
    responses = {
        "positive": [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes – definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
        ],
        "neutral": [
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
        ],
        "negative": [
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful.",
        ],
        "mysterious": [
            "The stars are not aligned for this answer.",
            "The crystal ball is cloudy.",
            "The spirits are silent on this matter.",
            "This question requires deeper meditation.",
            "The answer lies within you.",
        ],
        "playful": [
            "As likely as pigs flying!",
            "Does a bear... nevermind.",
            "Are you sure you want to know?",
            "I could tell you, but then I'd have to... forget it.",
            "Error 404: Answer not found. Just kidding!",
        ]
    }
    
    # Select a random category
    category = random.choice(list(responses.keys()))
    
    # Select a random response from the chosen category
    response = random.choice(responses[category])
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  # Adjust this if you want to restrict access
        },
        'body': json.dumps({
            'message': response,
            'category': category
        })
    }