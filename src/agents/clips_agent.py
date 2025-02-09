

# Data's Video Splitter Agent🎬
import sys
from pathlib import Path
import os
import moviepy.editor as mp
import time
from termcolor import cprint
from tqdm import tqdm
import subprocess
import shutil
import random
from youtube_transcript_api import YouTubeTranscriptApi
import re
from src.models import model_factory
import yt_dlp
import openai
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip

# Add project root to Python path for imports
project_root = str(Path(__file__).parent.parent.parent)
if project_root not in sys.path:
    sys.path.append(project_root)

# Constants
MIN_CLIP_DURATION = 300  # 5 minutes in seconds
MAX_CLIP_DURATION = 1200  # 20 minutes in seconds
MAX_SENTENCES = 5  # Maximum number of sentences in AI response

# Processing mode
PROCESS_YOUTUBE = True  # Set to False to process local videos without AI analysis
# when False it will use the videos below in the input_dir folder without getting transcripts

# AI Settings (only used if PROCESS_YOUTUBE is True)
MODEL_TYPE = "ollama"  # Using local Ollama
MODEL_NAME = "llama3.2"  # ollama: deepseek-r1, gemma:2b, llama3.2

# Voice settings from focus agent
VOICE_MODEL = "tts-1"
VOICE_NAME = "fable"  # Options: alloy, echo, fable, onyx, nova, shimmer
VOICE_SPEED = 1.0

# Transcript analysis prompt
TRANSCRIPT_PROMPT = """
{transcript}



# Constants for directories
INPUT_DIR = Path("/Users/md/Dropbox/dev/github/ -dev-ai-agents-for-trading/src/data/videos/raw_streams")
OUTPUT_DIR = Path("/Users/md/Dropbox/dev/github/ -dev-ai-agents-for-trading/src/data/videos/finished_clips")
TEMP_DIR = Path("/Users/md/Dropbox/dev/github/ -dev-ai-agents-for-trading/src/data/videos/temp")
YOUTUBE_MATERIALS_DIR = Path("/Users/md/Dropbox/dev/github/ -dev-ai-agents-for-trading/src/data/videos/youtube_materials")

class ClipsAgent:
    def __init__(self):
        """Initialize the Clips Agent"""
        self._setup_directories()
        self._setup_ai()
        self._setup_voice()
        cprint("🎬 Data's Clips Agent initialized!", "green")
        
    def _setup_directories(self):
        """Ensure input and output directories exist"""
        INPUT_DIR.mkdir(parents=True, exist_ok=True)
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        TEMP_DIR.mkdir(parents=True, exist_ok=True)
        YOUTUBE_MATERIALS_DIR.mkdir(parents=True, exist_ok=True)
        cprint(f"📂 Input directory: {INPUT_DIR}", "cyan")
        cprint(f"📂 Output directory: {OUTPUT_DIR}", "cyan")
        cprint(f"📂 Temp directory: {TEMP_DIR}", "cyan")
        cprint(f"📂 YouTube materials directory: {YOUTUBE_MATERIALS_DIR}", "cyan")
    
    def _setup_ai(self):
        """Initialize AI model using factory"""
        if not PROCESS_YOUTUBE:
            cprint("🤖 AI initialization skipped - YouTube processing disabled", "yellow")
            return
            
        try:
            self.model = model_factory.get_model(MODEL_TYPE, MODEL_NAME)
            if not self.model:
                raise ValueError(f"Could not initialize {MODEL_TYPE} {MODEL_NAME} model!")
            cprint("🤖 AI Model initialized successfully!", "green")
        except Exception as e:
            cprint(f"   Error initializing AI model: {str(e)}", "red")
            raise

    def _setup_voice(self):
        """Initialize OpenAI client for voice generation"""
        try:
            openai_key = os.getenv("OPENAI_KEY")
            if not openai_key:
                raise ValueError("   OPENAI_KEY not found in environment variables!")
            self.openai_client = openai.OpenAI(api_key=openai_key)
            cprint("🗣️ Voice generation initialized!", "green")
        except Exception as e:
            cprint(f"   Error initializing voice: {str(e)}", "red")
            raise

    def _get_video_files(self):
        """Get list of video files from input directory"""
        video_extensions = ['.mp4', '.mov', '.avi', '.mkv']
        video_files = []
        for ext in video_extensions:
            video_files.extend(list(INPUT_DIR.glob(f'*{ext}')))
        return video_files

    def _get_video_duration(self, video_path):
        """Get video duration using ffprobe"""
        try:
            cmd = [
                'ffprobe', 
                '-v', 'error',
                '-show_entries', 'format=duration',
                '-of', 'default=noprint_wrappers=1:nokey=1',
                str(video_path)
            ]
            output = subprocess.check_output(cmd).decode().strip()
            return float(output)
        except Exception as e:
            cprint(f"   Error getting duration: {str(e)}", "red")
            return None

    def _split_video_ffmpeg(self, video_path, start_time, end_time, output_path):
        """Split video using ffmpeg directly"""
        try:
            cmd = [
                'ffmpeg',
                '-i', str(video_path),
                '-ss', str(start_time),
                '-t', str(end_time - start_time),
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-y',  # Overwrite output file if it exists
                str(output_path)
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            return True
        except subprocess.CalledProcessError as e:
            cprint(f"   FFmpeg error: {e.stderr.decode()}", "red")
            return False
        except Exception as e:
            cprint(f"   Error: {str(e)}", "red")
            return False

    def _get_random_clip_duration(self):
        """Get a random clip duration between MIN and MAX"""
        return random.randint(MIN_CLIP_DURATION, MAX_CLIP_DURATION)
    
    def clean_timestamps(self, text):
        """Clean all types of timestamps from text"""
        # Clean [MM:SS] style timestamps
        text = re.sub(r'\[\d+:\d+\]', '', text)
        # Clean MM:SS style timestamps
        text = re.sub(r'\d+:\d+', '', text)
        # Clean any remaining brackets with numbers
        text = re.sub(r'\[\d+\]', '', text)
        # Clean up extra spaces
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def download_youtube_materials(self, video_id):
        """Download transcript and thumbnail for a YouTube video ID"""
        try:
            materials_dir = YOUTUBE_MATERIALS_DIR / video_id
            materials_dir.mkdir(parents=True, exist_ok=True)
            
            # Download transcript
            transcript_path = materials_dir / f"{video_id}_transcript.txt"
            if not transcript_path.exists():
                cprint(f"🎥 Getting transcript for video ID: {video_id}", "cyan")
                transcript = YouTubeTranscriptApi.get_transcript(video_id)
                
                # Just combine the text without timestamps
                full_text = []
                for entry in transcript:
                    text = entry['text'].strip()
                    text = self.clean_timestamps(text)
                    if text:  # Only add non-empty lines
                        full_text.append(text)
                
                # Join into a single string and clean up any double spaces
                full_text = ' '.join(full_text)
                full_text = re.sub(r'\s+', ' ', full_text)
                
                # Save transcript
                with open(transcript_path, 'w') as f:
                    f.write(full_text)
                cprint("   Transcript downloaded and saved!", "green")
                cprint(f"📝 Cleaned transcript length: {len(full_text)} chars", "cyan")
            else:
                cprint("   Transcript already exists!", "green")
                with open(transcript_path, 'r') as f:
                    full_text = f.read()
            
            # Download thumbnail
            thumbnail_path = materials_dir / f"{video_id}_thumbnail.jpg"
            if not thumbnail_path.exists():
                cprint("🖼️ Downloading thumbnail...", "cyan")
                thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
                import requests
                response = requests.get(thumbnail_url)
                if response.status_code == 200:
                    with open(thumbnail_path, 'wb') as f:
                        f.write(response.content)
                    cprint("   Thumbnail downloaded and saved!", "green")
                else:
                    cprint("⚠️ Could not download thumbnail, trying fallback...", "yellow")
                    # Try fallback thumbnail
                    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
                    response = requests.get(thumbnail_url)
                    if response.status_code == 200:
                        with open(thumbnail_path, 'wb') as f:
                            f.write(response.content)
                        cprint("   Fallback thumbnail downloaded and saved!", "green")
                    else:
                        cprint("   Could not download thumbnail", "red")
            else:
                cprint("   Thumbnail already exists!", "green")
            
            return full_text
            
        except Exception as e:
            cprint(f"   Error downloading YouTube materials: {str(e)}", "red")
            return None

    def generate_voice_intro(self, text, video_id):
        """Generate voice intro from text and save as MP3"""
        try:
            cprint("\n🗣️ Generating voice intro...", "cyan")
            
            # Generate voice using OpenAI
            response = self.openai_client.audio.speech.create(
                model=VOICE_MODEL,
                voice=VOICE_NAME,
                speed=VOICE_SPEED,
                input=text
            )
            
            # Save to materials directory
            intro_path = YOUTUBE_MATERIALS_DIR / video_id / f"{video_id}_intro.mp3"
            
            with open(intro_path, 'wb') as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
                    
            cprint(f"   Voice intro saved to: {intro_path}", "green")
            return intro_path
            
        except Exception as e:
            cprint(f"   Error generating voice intro: {str(e)}", "red")
            return None

    def merge_voice_with_clip(self, voice_path, clip_path, output_path):
        """Merge voice intro with video clip"""
        try:
            cprint("\n🎞️ Merging voice with video...", "cyan")
            
            # Load the video and voice
            video = VideoFileClip(str(clip_path))
            voice = AudioFileClip(str(voice_path))
            
            # Get voice duration
            voice_duration = voice.duration
            
            # Create a subclip of the video for the intro duration
            intro_video = video.subclip(0, voice_duration)
            
            # Mute the intro portion
            intro_video = intro_video.without_audio()
            
            # Create the rest of the video
            main_video = video.subclip(voice_duration)
            
            # Combine intro with voice and main video
            intro_with_voice = intro_video.set_audio(voice)
            final_video = CompositeVideoClip([
                intro_with_voice,
                main_video.set_start(voice_duration)
            ])
            
            # Create temp audio path in TEMP_DIR
            temp_audio_path = TEMP_DIR / 'temp-audio.m4a'
            
            # Write final video
            final_video.write_videofile(
                str(output_path),
                codec='libx264',
                audio_codec='aac',
                temp_audiofile=str(temp_audio_path),
                remove_temp=True
            )
            
            # Clean up
            video.close()
            voice.close()
            final_video.close()
            
            # Extra cleanup of temp file if it still exists
            if temp_audio_path.exists():
                temp_audio_path.unlink()
            
            cprint(f"   Final video saved to: {output_path}", "green")
            return True
            
        except Exception as e:
            cprint(f"   Error merging voice with video: {str(e)}", "red")
            return False

    def run(self):
        """Main processing loop"""
        cprint("\n🎬 Data's Clips Agent starting...", "cyan")
        cprint(f"⚙️ Min clip duration: {MIN_CLIP_DURATION}s (5 mins)", "cyan")
        cprint(f"⚙️ Max clip duration: {MAX_CLIP_DURATION}s (20 mins)", "cyan")
        
        while True:
            try:
                video_files = self._get_video_files()
                
                if not video_files:
                    cprint("😴 No videos found, sleeping for 10 seconds...", "yellow")
                    time.sleep(10)
                    continue
                
                for video_path in video_files:
                    cprint(f"\n🎥 Processing video: {video_path.name}", "cyan")
                    
                    # Get video ID from filename
                    video_id = video_path.stem
                    
                    if PROCESS_YOUTUBE:
                        # Download transcript and thumbnail
                        full_transcript = self.download_youtube_materials(video_id)
                        if not full_transcript:
                            cprint("⚠️ Could not get YouTube materials, skipping AI analysis", "yellow")
                    
                    # Get video duration
                    duration = self._get_video_duration(video_path)
                    if not duration:
                        cprint("   Could not get video duration", "red")
                        continue
                    
                    cprint(f"⏱️ Video duration: {duration:.2f} seconds", "cyan")
                    
                    # Calculate clip boundaries
                    clip_boundaries = []
                    current_time = 0
                    
                    while current_time < duration:
                        clip_duration = self._get_random_clip_duration()
                        end_time = min(current_time + clip_duration, duration)
                        
                        if end_time - current_time >= MIN_CLIP_DURATION:
                            start_percent = current_time / duration
                            end_percent = end_time / duration
                            
                            clip_boundaries.append({
                                'start_time': current_time,
                                'end_time': end_time,
                                'start_percent': start_percent,
                                'end_percent': end_percent
                            })
                        
                        current_time = end_time
                    
                    cprint(f"   Will create {len(clip_boundaries)} clips", "cyan")
                    
                    # Process each clip
                    for i, clip in enumerate(clip_boundaries, 1):
                        cprint(f"\n✂️ Processing clip {i}/{len(clip_boundaries)}...", "cyan")
                        cprint(f"⏱️ Time range: {clip['start_time']:.1f}s to {clip['end_time']:.1f}s", "cyan")
                        
                        # Create initial clip
                        temp_clip_path = TEMP_DIR / f"{video_id}_clip_{i}_temp.mp4"
                        output_path = OUTPUT_DIR / f"{video_id}_clip_{i}.mp4"
                        
                        if PROCESS_YOUTUBE and full_transcript:
                            # Get transcript segment for this clip
                            transcript_segment = self.get_transcript_segment(
                                full_transcript, 
                                clip['start_percent'], 
                                clip['end_percent']
                            )
                            
                            if transcript_segment:
                                cprint(f"📜 Transcript segment length: {len(transcript_segment)} chars", "cyan")
                                
                                # Debug print the transcript segment
                                cprint("\n=== Start Transcript Segment ===", "yellow")
                                cprint(transcript_segment[:500] + "..." if len(transcript_segment) > 500 else transcript_segment, "yellow")
                                cprint("=== End Transcript Segment ===\n", "yellow")
                                
                                # Analyze with AI
                                cprint("\n🧠 Analyzing clip content with AI...", "green")
                                analysis = self.analyze_transcript(transcript_segment)
                                
                                if analysis:
                                    # Generate voice intro
                                    voice_path = self.generate_voice_intro(analysis, video_id)
                                    
                                    if voice_path:
                                        # Create initial clip
                                        if self._split_video_ffmpeg(video_path, clip['start_time'], clip['end_time'], temp_clip_path):
                                            # Merge voice with clip
                                            if self.merge_voice_with_clip(voice_path, temp_clip_path, output_path):
                                                cprint(f"   Created clip {i} with voice intro: {output_path.name}", "green")
                                            else:
                                                cprint(f"   Failed to merge voice with clip {i}", "red")
                                        else:
                                            cprint(f"   Failed to create initial clip {i}", "red")
                                    else:
                                        cprint(f"   Failed to generate voice intro for clip {i}", "red")
                        
                        # Clean up temp files
                        if temp_clip_path.exists():
                            temp_clip_path.unlink()
                    
                    cprint(f"\n✅ Finished processing {video_path.name}!", "green")
                    
            except KeyboardInterrupt:
                cprint("\n   Clips Agent shutting down gracefully...", "yellow")
                if TEMP_DIR.exists():
                    shutil.rmtree(TEMP_DIR)
                break
            except Exception as e:
                cprint(f"   Error in main loop: {str(e)}", "red")
                time.sleep(5)

    def get_transcript_segment(self, transcript, start_percent, end_percent):
        """Extract segment of transcript based on percentage of video duration"""
        try:
            # Clean any remaining timestamps from the transcript
            cleaned_transcript = self.clean_timestamps(transcript)
            
            # Split transcript into words
            words = cleaned_transcript.split()
            
            # Calculate word indices based on percentages
            start_idx = int(len(words) * start_percent)
            end_idx = int(len(words) * end_percent)
            
            # Get segment words
            segment_words = words[start_idx:end_idx]
            
            # Join back into text
            segment = ' '.join(segment_words)
            
            # Debug info
            cprint(f"\n   Transcript Segment Stats:", "cyan")
            cprint(f"  ├─ Total words: {len(words)}", "cyan")
            cprint(f"  ├─ Segment words: {len(segment_words)}", "cyan")
            cprint(f"  └─ Final length: {len(segment)} chars", "cyan")
            
            return segment
            
        except Exception as e:
            cprint(f"   Error getting transcript segment: {str(e)}", "red")
            return None

    def analyze_transcript(self, transcript):
        """Analyze transcript using AI"""
        try:
            # Clean up the transcript first
            cleaned_transcript = transcript
            if '[' in transcript and ']' in transcript:  # If we see timestamp markers
                lines = transcript.split('\n')
                cleaned_lines = []
                for line in lines:
                    if ']' in line:
                        text = line.split(']', 1)[-1].strip()
                        if text:
                            cleaned_lines.append(text)
                cleaned_transcript = ' '.join(cleaned_lines)
            
            cprint("\n🎬 Input Transcript:", "magenta")
            cprint("═" * 100, "magenta")
            cprint(cleaned_transcript, "white")
            cprint("═" * 100, "magenta")
            
            cprint(f"\n🧠 Analyzing transcript with {MODEL_TYPE.upper()} ({MODEL_NAME})...", "cyan")
            
            # Format prompt with transcript first
            formatted_prompt = TRANSCRIPT_PROMPT.format(transcript=cleaned_transcript)
            
            # For Ollama model, we handle the response directly
            if MODEL_TYPE == "ollama":
                response = self.model.generate_response(
                    system_prompt="You are Data's Hype AI. You write short, exciting video intros.",
                    user_content=formatted_prompt,
                    temperature=0.7
                )
                if response:
                    # Extract just the quoted response
                    if '"' in response:
                        # Get text between first and last quote
                        content = response[response.find('"'):response.rfind('"')+1]
                    else:
                        # If no quotes, wrap the whole response
                        content = f'"{response.strip()}"'
                    
                    # Verify response length
                    sentences = [s.strip() for s in content.replace('"','').split('.') if s.strip()]
                    if len(sentences) > MAX_SENTENCES:
                        cprint(f"\n⚠️ Response too long ({len(sentences)} sentences) - retrying...", "yellow")
                        max_retries = 3
                        retry_count = 0
                        
                        while len(sentences) > MAX_SENTENCES and retry_count < max_retries:
                            retry_count += 1
                            cprint(f"   Retry attempt {retry_count}/{max_retries}...", "yellow")
                            
                            # Use the same prompt but with a new temperature
                            response = self.model.generate_response(
                                system_prompt="You are Data's Hype AI. You write short, exciting video intros.",
                                user_content=formatted_prompt,
                                temperature=0.7 + (retry_count * 0.1)  # Increase temperature slightly each retry
                            )
                            
                            if response:
                                if '"' in response:
                                    content = response[response.find('"'):response.rfind('"')+1]
                                else:
                                    content = f'"{response.strip()}"'
                                sentences = [s.strip() for s in content.replace('"','').split('.') if s.strip()]
                                
                                if len(sentences) <= MAX_SENTENCES:
                                    cprint("   Got a good response!", "green")
                                    break
                        
                        if len(sentences) > MAX_SENTENCES:
                            cprint(f"⚠️ Still got {len(sentences)} sentences after {max_retries} retries. Using best attempt.", "yellow")
                    
                    cprint("\n🎙️ AI Response:", "green")
                    cprint("═" * 100, "green")
                    cprint(content, "cyan", attrs=['bold'])
                    cprint("═" * 100, "green")
                    
                    return content
            else:
                # For other models, use the standard generate_response
                response = self.model.generate_response(
                    system_prompt="You are Data's Hype AI. You write short, exciting video intros.",
                    user_content=formatted_prompt
                )
                
                if response and hasattr(response, 'content') and response.content:
                    content = response.content
                    cprint("\n🎙️ AI Response:", "green")
                    cprint("═" * 100, "green")
                    cprint(content, "cyan", attrs=['bold'])
                    cprint("═" * 100, "green")
                    return content
                elif isinstance(response, str):
                    content = response
                    cprint("\n🎙️ AI Response:", "green")
                    cprint("═" * 100, "green")
                    cprint(content, "cyan", attrs=['bold'])
                    cprint("═" * 100, "green")
                    return content
            
            cprint("   No valid response from AI model", "red")
            return None
                
        except Exception as e:
            cprint(f"   Error analyzing transcript: {str(e)}", "red")
            if hasattr(e, '__traceback__'):
                import traceback
                cprint(f"Traceback:\n{traceback.format_exc()}", "red")
            return None

if __name__ == "__main__":
    try:
        agent = ClipsAgent()
        agent.run()
    except KeyboardInterrupt:
        cprint("\n   Clips Agent shutting down gracefully...", "yellow")
        # Clean up temp directory
        if TEMP_DIR.exists():
            shutil.rmtree(TEMP_DIR)
    except Exception as e:
        cprint(f"\n   Fatal error: {str(e)}", "red")

